using System;

namespace Domain.Entities
{
    public class Match
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // The tournament this match belongs to
        public Guid TournamentId { get; set; }
        public Tournament Tournament { get; set; } = null!;

        // Team 1 (Nullable, because they might be determined in later rounds)
        public Guid? Team1Id { get; set; }
        public Team? Team1 { get; set; }

        // Team 2 (Nullable)
        public Guid? Team2Id { get; set; }
        public Team? Team2 { get; set; }

        // The winner of the match (Nullable until the match is finished)
        public Guid? WinnerId { get; set; }
        public Team? Winner { get; set; }

        // Round number (e.g., 1 = Quarterfinals, 2 = Semifinals)
        public int Round { get; set; }

        // State of the match: "Pending", "InProgress", "Completed"
        public string Status { get; set; } = "Pending";
    }
}