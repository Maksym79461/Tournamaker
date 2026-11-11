using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Tournament
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = string.Empty; // Назва (напр. "Осінній кубок CS2")
        public string Game { get; set; } = string.Empty; // Дисципліна (Dota 2, CS2, Шахи)
        public int MaxTeams { get; set; } // Скільки команд максимум (8, 16, 32)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // --- Встановлюємо зв'язок з організатором (Користувачем) ---
        // Це Foreign Key (Зовнішній ключ). Зберігає ID користувача, який створив турнір.
        public Guid OrganizerId { get; set; }

        // Навігаційна властивість. Дозволяє в коді отримати всі дані організатора (ім'я, email)
        // просто звернувшись до tournament.Organizer.
        public User Organizer { get; set; } = null!;

        // Зв'язок: "Один турнір містить багато команд"
        public ICollection<Team> Teams { get; set; } = new List<Team>();

        public int Format { get; set; } // Можна пізніше зробити Enum (SingleElimination, RoundRobin тощо)
        public int Status { get; set; } // Наприклад: 0 - Створено, 1 - В процесі, 2 - Завершено
                                        // (Поле CreatedAt у нас вже є)
    }
}