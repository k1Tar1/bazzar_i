import re
from rest_framework import serializers

def validate_phone(value):
    value = re.sub(r"[^\d+]", "", value)

    if value.startswith("0"):
        value = "213" + value[1:]
    elif value.startswith("+213"):
        value = value[1:]

    if not re.fullmatch(r"213[567]\d{8}", value):
        raise serializers.ValidationError(
            "Enter a valid Algerian phone number."
        )

    return value