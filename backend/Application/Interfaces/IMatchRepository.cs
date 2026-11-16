using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IMatchRepository
    {
        Task AddRangeAsync(IEnumerable<Match> matches);
        Task<IEnumerable<Match>> GetByTournamentIdAsync(Guid tournamentId);
    }
}