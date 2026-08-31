from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.identity.serializers import UserSerializer
from apps.students.models import Student, Semester, AcademicCommittee

User = get_user_model()


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = [
            'id',
            'student',
            'numero',
            'fecha_inicio',
            'fecha_fin',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        fecha_inicio = attrs.get('fecha_inicio', getattr(self.instance, 'fecha_inicio', None))
        fecha_fin = attrs.get('fecha_fin', getattr(self.instance, 'fecha_fin', None))
        if fecha_inicio and fecha_fin and fecha_fin < fecha_inicio:
            raise serializers.ValidationError({
                'fecha_fin': 'La fecha de fin no puede ser anterior a la fecha de inicio.'
            })

        numero = attrs.get('numero', getattr(self.instance, 'numero', None))
        if numero is not None and (numero < 1 or numero > 6):
            raise serializers.ValidationError({
                'numero': 'El número de semestre debe estar entre 1 y 6.'
            })

        return attrs


class AcademicCommitteeSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)
    rol_comite_display = serializers.CharField(source='get_rol_comite_display', read_only=True)

    class Meta:
        model = AcademicCommittee
        fields = [
            'id',
            'student',
            'user',
            'user_detail',
            'rol_comite',
            'rol_comite_display',
            'fecha_asignacion',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'rol_comite_display']

    def validate_user(self, value):
        if value.role not in ['ASESOR', 'COORDINADOR'] and not value.is_superuser:
            raise serializers.ValidationError(
                "Solo se pueden asignar usuarios con rol ASESOR o COORDINADOR al comité académico."
            )
        return value

    def validate(self, attrs):
        student = attrs.get('student', getattr(self.instance, 'student', None))
        user = attrs.get('user', getattr(self.instance, 'user', None))
        rol_comite = attrs.get('rol_comite', getattr(self.instance, 'rol_comite', None))

        if student and user and rol_comite:
            qs = AcademicCommittee.objects.filter(
                student=student,
                user=user,
                rol_comite=rol_comite
            )
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    "Este usuario ya tiene asignado este rol en el comité académico del estudiante."
                )
        return attrs


class StudentSerializer(serializers.ModelSerializer):
    semesters = SemesterSerializer(many=True, read_only=True)
    committee_members = AcademicCommitteeSerializer(many=True, read_only=True)
    total_semesters = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id',
            'user',
            'matricula',
            'nombre_completo',
            'programa_doctoral',
            'cohorte',
            'estatus_activo',
            'semesters',
            'total_semesters',
            'committee_members',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_semesters']

    def get_total_semesters(self, obj):
        return obj.semesters.count()


class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'id',
            'user',
            'matricula',
            'nombre_completo',
            'programa_doctoral',
            'cohorte',
            'estatus_activo',
        ]
        read_only_fields = ['id']

    def validate_matricula(self, value):
        qs = Student.objects.filter(matricula__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Ya existe un estudiante con esta matrícula.")
        return value.strip().upper()
