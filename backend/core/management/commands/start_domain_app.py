from django.core.management import call_command
from django.core.management import CommandError
import os
from django.core.management.base import BaseCommand
from django.core.management import execute_from_command_line

class Command(BaseCommand):
    help = "Start a new domain app"

    def add_arguments(self, parser):
        parser.add_argument("domain", type=str)
        parser.add_argument(
            'app_names',
            type=str,
            nargs='+'
        )

    def handle(self, *args, **options):
        domain = options["domain"]
        app_names = options["app_names"]

        os.makedirs(f"apps/{domain}", exist_ok=True)

        if not os.path.exists(f"apps/{domain}/__init__.py"):
            with open(f"apps/{domain}/__init__.py", "w") as f:
                f.write("")
        
        for app_name in app_names:   
            if not domain.isidentifier() or not app_name.isidentifier():
                raise CommandError('Domain and app name must be valid Python identifiers')
            
            target_path = f"apps/{domain}/{app_name}"

            if os.path.exists(target_path):
                raise CommandError(f'Domain app {domain}/{app_name} already exists')
            
            call_command("startapp", app_name)

            # Create the parent directory (e.g. apps/identity) rather than the leaf directory,
            # so os.rename can rename the directory without conflicting with an existing leaf directory.
            

            os.rename(app_name, target_path)
            
            apps_py_path = os.path.join(target_path, 'apps.py')

            
            with open(apps_py_path, 'w') as f:
                f.write(f"""from django.apps import AppConfig


class {app_name.capitalize()}Config(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.{domain}.{app_name}"
""")


            self.stdout.write(self.style.SUCCESS(f'Successfully started a new app {app_name} in domain {domain}'))

