from rest_framework import serializers

from mathesar.api.exceptions.mixins import MathesarErrorMessageMixin


class RecordListParameterSerializer(MathesarErrorMessageMixin, serializers.Serializer):
    filters = serializers.JSONField(required=False, default=[])
    order_by = serializers.JSONField(required=False, default=[])
    group_count_by = serializers.JSONField(required=False, default=[])


class RecordSerializer(MathesarErrorMessageMixin, serializers.BaseSerializer):
    def to_representation(self, instance):
        return instance._asdict()
