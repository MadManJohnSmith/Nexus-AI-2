from rest_framework import serializers
from .models import ThesisProgress, default_thesis_components
from apps.students.models import Student, Semester


class ThesisProgressSerializer(serializers.ModelSerializer):
    student_nombre = serializers.CharField(source='student.nombre_completo', read_only=True)
    student_matricula = serializers.CharField(source='student.matricula', read_only=True)
    semester_numero = serializers.IntegerField(source='semester.numero', read_only=True)

    class Meta:
        model = ThesisProgress
        fields = [
            'id',
            'student',
            'student_nombre',
            'student_matricula',
            'semester',
            'semester_numero',
            'porcentaje_avance',
            'componentes_json',
            'observaciones',
            'fecha_registro',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'student_nombre',
            'student_matricula',
            'semester_numero',
            'created_at',
            'updated_at'
        ]


class ThesisProgressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThesisProgress
        fields = [
            'id',
            'student',
            'semester',
            'porcentaje_avance',
            'componentes_json',
            'observaciones',
            'fecha_registro'
        ]
        extra_kwargs = {
            'observaciones': {'required': False, 'allow_blank': True},
            'fecha_registro': {'required': False},
            'componentes_json': {'required': False}
        }

    def validate_porcentaje_avance(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("El porcentaje de avance debe estar entre 0 y 100.")
        return value

    def validate_componentes_json(self, value):
        if value is None:
            return default_thesis_components()
        if not isinstance(value, dict):
            raise serializers.ValidationError("El desglose de componentes debe ser un objeto JSON.")
        
        valid_keys = {'protocolo', 'estadoArte', 'marcoTeorico', 'metodologia', 'analisis', 'redaccion'}
        for key, val in value.items():
            if key in valid_keys:
                if not isinstance(val, (int, float)) or val < 0 or val > 100:
                    raise serializers.ValidationError(f"El componente '{key}' debe ser un valor numérico entre 0 y 100.")
        return value

    def validate(self, attrs):
        student = attrs.get('student')
        semester = attrs.get('semester')
        if student and semester and semester.student_id != student.id:
            raise serializers.ValidationError({
                'semester': "El semestre seleccionado no pertenece al estudiante asignado."
            })
        return attrs
