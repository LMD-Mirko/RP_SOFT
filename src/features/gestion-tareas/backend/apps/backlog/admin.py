from django.contrib import admin
# from apps.backlog.domain.models import BacklogItem, BacklogComment


# @admin.register(BacklogItem)
# class BacklogItemAdmin(admin.ModelAdmin):
#     list_display = ['title', 'priority', 'status', 'assigned_to', 'due_date', 'is_overdue', 'created_at']
#     list_filter = ['priority', 'status', 'created_at', 'due_date']
#     search_fields = ['title', 'description']
#     readonly_fields = ['created_at', 'updated_at', 'id']
#     
#     fieldsets = (
#         ('Información General', {
#             'fields': ('title', 'description', 'priority', 'status')
#         }),
#         ('Asignación y Fechas', {
#             'fields': ('assigned_to', 'due_date', 'created_by')
#         }),
#         ('Detalles Técnicos', {
#             'fields': ('story_points', 'labels'),
#             'classes': ('collapse',)
#         }),
#         ('Metadatos', {
#             'fields': ('id', 'created_at', 'updated_at'),
#             'classes': ('collapse',)
#         })
#     )
#     
#     def save_model(self, request, obj, form, change):
#         if not change:
#             obj.created_by = request.user
#         super().save_model(request, obj, form, change)


# @admin.register(BacklogComment)
# class BacklogCommentAdmin(admin.ModelAdmin):
#     list_display = ['backlog_item', 'author', 'content', 'created_at']
#     list_filter = ['created_at']
#     search_fields = ['content', 'backlog_item__title']
#     readonly_fields = ['created_at', 'updated_at']
#     
#     fieldsets = (
#         ('Información del Comentario', {
#             'fields': ('backlog_item', 'content', 'author')
#         }),
#         ('Metadatos', {
#             'fields': ('created_at', 'updated_at'),
#             'classes': ('collapse',)
#         })
#     )
#     
#     def save_model(self, request, obj, form, change):
#         if not change:
#             obj.author = request.user
#         super().save_model(request, obj, form, change)