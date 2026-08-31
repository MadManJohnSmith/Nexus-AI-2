from datetime import date, timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status

from apps.students.models import Student, Semester, AcademicCommittee
from apps.academic_output.models import Publication
from apps.evidence.models import Evidence

User = get_user_model()


class AcademicOutputTests(APITestCase):
    def setUp(self):
        # 1. Coordinador
        self.coordinator = User.objects.create_superuser(
            email='coord@nexus.edu.mx',
            password='Password123!',
            first_name='Dr. Carlos',
            last_name='Coordinador'
        )

        # 2. Asesor Principal
        self.advisor_main = User.objects.create_user(
            email='asesor1@nexus.edu.mx',
            password='Password123!',
            first_name='Dra. Elena',
            last_name='Ramos',
            role='ASESOR'
        )

        # 3. Asesor Ajeno
        self.advisor_other = User.objects.create_user(
            email='asesor_otro@nexus.edu.mx',
            password='Password123!',
            first_name='Dr. Roberto',
            last_name='Soto',
            role='ASESOR'
        )

        # 4. Estudiante 1
        self.student_user1 = User.objects.create_user(
            email='estudiante1@nexus.edu.mx',
            password='Password123!',
            first_name='Juan',
            last_name='Pérez',
            role='ESTUDIANTE'
        )
        self.student1 = Student.objects.create(
            user=self.student_user1,
            matricula='DOC-2025-001',
            nombre_completo='Juan Pérez',
            cohorte='2025-A'
        )
        self.semester1 = Semester.objects.create(
            student=self.student1,
            numero=1,
            fecha_inicio=date.today() - timedelta(days=60),
            fecha_fin=date.today() + timedelta(days=120)
        )
        AcademicCommittee.objects.create(
            student=self.student1,
            user=self.advisor_main,
            rol_comite='ASESOR_PRINCIPAL',
            is_active=True
        )

        # 5. Estudiante 2
        self.student_user2 = User.objects.create_user(
            email='estudiante2@nexus.edu.mx',
            password='Password123!',
            first_name='María',
            last_name='Gómez',
            role='ESTUDIANTE'
        )
        self.student2 = Student.objects.create(
            user=self.student_user2,
            matricula='DOC-2025-002',
            nombre_completo='María Gómez',
            cohorte='2025-A'
        )
        self.semester2 = Semester.objects.create(
            student=self.student2,
            numero=1,
            fecha_inicio=date.today() - timedelta(days=60),
            fecha_fin=date.today() + timedelta(days=120)
        )

    # ----------------- HU-17: PUBLICACIONES -----------------
    def test_create_publication_success(self):
        self.client.force_authenticate(user=self.advisor_main)
        payload = {
            'student': self.student1.id,
            'semester': self.semester1.id,
            'titulo': 'Deep Learning for Bioimaging in Oncology',
            'autores_texto': 'Pérez, J., Ramos, E.',
            'tipo': 'ARTICULO_JCR',
            'revista_editorial': 'IEEE Transactions on Medical Imaging',
            'estado': 'PUBLICADO',
            'fecha_publicacion': '2025-02-15',
            'doi_url': 'https://doi.org/10.1109/TMI.2025.100200'
        }
        response = self.client.post('/api/v2/academic-output/publications/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('publication_created_id', response.data)
        self.assertEqual(response.data['mensaje'], 'Publicación registrada correctamente')
        self.assertEqual(response.data['publication']['titulo'], payload['titulo'])
        self.assertEqual(response.data['publication']['student_matricula'], 'DOC-2025-001')
        self.assertEqual(response.data['publication']['tipo_display'], 'Artículo JCR / Scopus')

    def test_create_publication_semester_mismatch(self):
        self.client.force_authenticate(user=self.advisor_main)
        payload = {
            'student': self.student1.id,
            'semester': self.semester2.id,  # Pertenece a estudiante2
            'titulo': 'Invalid Mismatch Paper',
            'autores_texto': 'Pérez, J.',
            'tipo': 'ARTICULO_CONACYT',
            'revista_editorial': 'Revista Mexicana de Computación',
            'estado': 'PREPARACION'
        }
        response = self.client.post('/api/v2/academic-output/publications/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('semester', response.data)

    def test_list_publications_rbac_isolation(self):
        # Crear publicación para estudiante 1 y estudiante 2
        Publication.objects.create(
            student=self.student1,
            semester=self.semester1,
            titulo='Paper Student 1',
            autores_texto='Pérez, J.',
            tipo='ARTICULO_JCR',
            revista_editorial='IEEE Trans',
            estado='PUBLICADO'
        )
        Publication.objects.create(
            student=self.student2,
            semester=self.semester2,
            titulo='Paper Student 2',
            autores_texto='Gómez, M.',
            tipo='ARTICULO_CONACYT',
            revista_editorial='Revista Nal',
            estado='ACEPTADO'
        )

        # 1. Asesor asignado a estudiante 1
        self.client.force_authenticate(user=self.advisor_main)
        res = self.client.get('/api/v2/academic-output/publications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data.get('results', res.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['titulo'], 'Paper Student 1')

        # 2. Asesor ajeno
        self.client.force_authenticate(user=self.advisor_other)
        res = self.client.get('/api/v2/academic-output/publications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data.get('results', res.data)
        self.assertEqual(len(results), 0)

        # 3. Estudiante 1 solo ve sus publicaciones
        self.client.force_authenticate(user=self.student_user1)
        res = self.client.get('/api/v2/academic-output/publications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data.get('results', res.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['titulo'], 'Paper Student 1')

        # 4. Coordinador ve todo
        self.client.force_authenticate(user=self.coordinator)
        res = self.client.get('/api/v2/academic-output/publications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data.get('results', res.data)
        self.assertEqual(len(results), 2)

    def test_delete_publication_success(self):
        pub = Publication.objects.create(
            student=self.student1,
            titulo='Paper to Delete',
            autores_texto='Pérez, J.',
            tipo='OTRO',
            revista_editorial='Tech Report'
        )
        self.client.force_authenticate(user=self.coordinator)
        response = self.client.delete(f'/api/v2/academic-output/publications/{pub.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['details'], 'Recurso eliminado correctamente')
        self.assertTrue(response.data['success'])
        self.assertFalse(Publication.objects.filter(id=pub.id).exists())
