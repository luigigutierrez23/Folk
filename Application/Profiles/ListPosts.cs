using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListPosts
    {
        public class Query : IRequest<Result<List<UserPostDTO>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserPostDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserPostDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.PostsAttendee
                    .Where(u => u.AppUser.UserName == request.Username)
                    .OrderBy(a => a.Post.Date)
                    .ProjectTo<UserPostDTO>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(a => a.Date <= DateTime.UtcNow),
                    "hosting" => query.Where(a => a.HostUsername == request.Username),
                    _ => query.Where(a => a.Date >= DateTime.UtcNow)
                };

                var posts = await query.ToListAsync();

                return Result<List<UserPostDTO>>.Success(posts);
            }
        }
    }
}