using System;
using System.Collections.Generic;

namespace Domain.Entities
{
	// Клас User представляє таблицю "Користувачі" в базі даних.
	public class User
	{
		// Унікальний ідентифікатор. У БД це буде Primary Key (Головний ключ).
		// Guid генерує складний рядок букв і цифр, щоб ID ніколи не збігалися.
		public Guid Id { get; set; } = Guid.NewGuid();

		public string Username { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;

		// Поле для майбутньої авторизації через Steam (SteamID64)
		public string? SteamId { get; set; }

		// Навігаційна властивість (Зв'язок).
		// Каже системі: "Один користувач може бути організатором багатьох турнірів".
		public ICollection<Tournament> OrganizedTournaments { get; set; } = new List<Tournament>();

        public string PasswordHash { get; set; } = string.Empty; // Для безпечного збереження паролів
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}