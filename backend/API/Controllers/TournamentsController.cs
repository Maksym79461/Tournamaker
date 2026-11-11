using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TournamentsController : ControllerBase
    {
        private readonly ITournamentRepository _tournamentRepository;
        private readonly IUserRepository _userRepository;

        public TournamentsController(ITournamentRepository tournamentRepository, IUserRepository userRepository)
        {
            _tournamentRepository = tournamentRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTournament([FromBody] CreateTournamentDto request)
        {
            // Перевіряємо, чи існує такий організатор
            var organizer = await _userRepository.GetByIdAsync(request.OrganizerId);
            if (organizer == null)
            {
                return BadRequest("Organizer not found.");
            }

            var tournament = new Tournament
            {
                Name = request.Name,
                Game = request.Game,
                MaxTeams = request.MaxTeams,
                OrganizerId = request.OrganizerId
            };

            var createdTournament = await _tournamentRepository.AddAsync(tournament);

            var response = new TournamentResponseDto
            {
                Id = createdTournament.Id,
                Name = createdTournament.Name,
                Game = createdTournament.Game,
                MaxTeams = createdTournament.MaxTeams,
                CreatedAt = createdTournament.CreatedAt
            };

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetTournaments()
        {
            var tournaments = await _tournamentRepository.GetAllAsync();
            var response = tournaments.Select(t => new TournamentResponseDto
            {
                Id = t.Id,
                Name = t.Name,
                Game = t.Game,
                MaxTeams = t.MaxTeams,
                CreatedAt = t.CreatedAt
            });

            return Ok(response);
        }
    }
}