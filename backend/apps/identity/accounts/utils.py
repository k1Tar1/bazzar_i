import re

def normalize_phone(value):
    value = re.sub(r"[^\d+]", "", value)

    if value.startswith("+213"):
        value = value[1:]
    elif value.startswith("0"):
        value = "213" + value[1:]

    return value