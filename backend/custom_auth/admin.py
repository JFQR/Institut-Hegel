from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, TeacherProfile, StudentProfile

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'name', 'is_teacher', 'is_accepted', 'is_staff', 'is_active')
    list_filter = ('is_teacher', 'is_accepted', 'is_staff', 'is_active', 'level', 'sex', 'country')
    search_fields = ('email', 'name')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('name', 'country', 'age', 'sex', 'id_papers', 'photo')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_teacher', 'is_accepted', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Other'), {'fields': ('level',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'is_teacher', 'is_accepted', 'is_staff', 'is_active')}
        ),
    )

    filter_horizontal = ('groups', 'user_permissions',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(TeacherProfile)
admin.site.register(StudentProfile)
