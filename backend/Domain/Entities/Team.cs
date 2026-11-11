
using System;

namespace Domain.Entities
{
    public class Team
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;

        // Кожна команда має капітана (це теж Користувач)
        public Guid CaptainId { get; set; }
        public User Captain { get; set; } = null!;

        // До якого турніру належить ця команда
        public Guid TournamentId { get; set; }
        public Tournament Tournament { get; set; } = null!;

        public string? LogoUrl { get; set; } // Посилання на логотип команди
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}