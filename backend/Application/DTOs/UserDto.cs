using System;

namespace Application.DTOs
{
    // Те, що ми отримуємо від клієнта при реєстрації
    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? SteamId { get; set; }
    }

    // Те, що ми повертаємо клієнту (без паролів чи зайвих даних)
    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}