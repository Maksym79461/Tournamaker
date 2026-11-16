using System;

namespace Application.DTOs
{
	public class CreateTeamDto
	{
		public string Name { get; set; } = string.Empty;
		public Guid CaptainId { get; set; }
		public Guid TournamentId { get; set; }
		public string? LogoUrl { get; set; }
	}

	public class TeamResponseDto
	{
		public Guid Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public Guid CaptainId { get; set; }
		public Guid TournamentId { get; set; }
		public string? LogoUrl { get; set; }
		public DateTime CreatedAt { get; set; }
	}
}