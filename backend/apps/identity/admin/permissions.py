from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    message = "You must be an administrator to perform this action."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.groups.filter(name="Admin").exists()
        )