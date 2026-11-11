using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface ITournamentRepository
    {
        Task<Tournament> AddAsync(Tournament tournament);
        Task<IEnumerable<Tournament>> GetAllAsync();
    }
}