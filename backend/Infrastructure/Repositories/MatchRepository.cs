using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class MatchRepository : IMatchRepository
    {
        private readonly AppDbContext _context;

        public MatchRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddRangeAsync(IEnumerable<Match> matches)
        {
            await _context.Matches.AddRangeAsync(matches);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Match>> GetByTournamentIdAsync(Guid tournamentId)
        {
            // Include related Team entities to get their names easily
            return await _context.Matches
                .Include(m => m.Team1)
                .Include(m => m.Team2)
                .Include(m => m.Winner)
                .Where(m => m.TournamentId == tournamentId)
                .ToListAsync();
        }
    }
}