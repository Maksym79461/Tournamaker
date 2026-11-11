using System;

namespace Application.DTOs
{
    public class CreateTournamentDto
    {
        public string Name { get; set; } = string.Empty;
        public string Game { get; set; } = string.Empty;
        public int MaxTeams { get; set; }
        public Guid OrganizerId { get; set; } // ID користувача, який створює турнір
    }

    public class TournamentResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Game { get; set; } = string.Empty;
        public int MaxTeams { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}