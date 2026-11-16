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
    public class TeamsController : ControllerBase
    {
        private readonly ITeamRepository _teamRepository;
        private readonly IUserRepository _userRepository;

        public TeamsController(ITeamRepository teamRepository, IUserRepository userRepository)
        {
            _teamRepository = teamRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamDto request)
        {
            // Verify if the captain exists in the Users table
            var captain = await _userRepository.GetByIdAsync(request.CaptainId);
            if (captain == null)
            {
                return BadRequest("Captain (User) not found.");
            }

            var team = new Team
            {
                Name = request.Name,
                CaptainId = request.CaptainId,
                TournamentId = request.TournamentId,
                LogoUrl = request.LogoUrl
            };

            var createdTeam = await _teamRepository.AddAsync(team);

            var response = new TeamResponseDto
            {
                Id = createdTeam.Id,
                Name = createdTeam.Name,
                CaptainId = createdTeam.CaptainId,
                LogoUrl = createdTeam.LogoUrl,
                CreatedAt = createdTeam.CreatedAt
            };

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetTeams()
        {
            var teams = await _teamRepository.GetAllAsync();
            var response = teams.Select(t => new TeamResponseDto
            {
                Id = t.Id,
                Name = t.Name,
                CaptainId = t.CaptainId,
                LogoUrl = t.LogoUrl,
                CreatedAt = t.CreatedAt
            });

            return Ok(response);
        }
    }
}