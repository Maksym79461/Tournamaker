using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly IMatchRepository _matchRepository;
        private readonly ITeamRepository _teamRepository;

        public MatchesController(IMatchRepository matchRepository, ITeamRepository teamRepository)
        {
            _matchRepository = matchRepository;
            _teamRepository = teamRepository;
        }

        [HttpPost("generate/{tournamentId}")]
        public async Task<IActionResult> GenerateBracket(Guid tournamentId)
        {
            // 1. Fetch all teams and filter for this tournament
            var allTeams = await _teamRepository.GetAllAsync();
            var tournamentTeams = allTeams.Where(t => t.TournamentId == tournamentId).ToList();

            if (tournamentTeams.Count < 2)
            {
                return BadRequest("Not enough teams. At least 2 teams are required to generate a bracket.");
            }

            // 2. Check if a bracket already exists
            var existingMatches = await _matchRepository.GetByTournamentIdAsync(tournamentId);
            if (existingMatches.Any())
            {
                return BadRequest("Bracket has already been generated for this tournament.");
            }

            // 3. Shuffle teams for random matchmaking
            var random = new Random();
            var shuffledTeams = tournamentTeams.OrderBy(x => random.Next()).ToList();

            // 4. Create Round 1 matches (Pairing them 2 by 2)
            var matches = new List<Match>();
            for (int i = 0; i < shuffledTeams.Count; i += 2)
            {
                var match = new Match
                {
                    TournamentId = tournamentId,
                    Round = 1,
                    Team1Id = shuffledTeams[i].Id,
                    // If odd number of teams, the last team gets a "BYE" (null opponent)
                    Team2Id = (i + 1 < shuffledTeams.Count) ? shuffledTeams[i + 1].Id : null,
                    Status = "Pending"
                };
                matches.Add(match);
            }

            // 5. Save matches to DB
            await _matchRepository.AddRangeAsync(matches);

            return Ok("Bracket generated successfully.");
        }

        [HttpGet("tournament/{tournamentId}")]
        public async Task<IActionResult> GetMatches(Guid tournamentId)
        {
            var matches = await _matchRepository.GetByTournamentIdAsync(tournamentId);

            // Format data for frontend (Flatten the object to avoid sending heavy nested entities)
            var response = matches.Select(m => new
            {
                m.Id,
                m.Round,
                m.Status,
                Team1Name = m.Team1?.Name ?? "BYE (No Opponent)",
                Team2Name = m.Team2?.Name ?? "BYE (No Opponent)",
                WinnerName = m.Winner?.Name
            });

            return Ok(response);
        }
    }
}