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

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<Result<List<CommentDTO>>>
        {
            public Guid PostId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<CommentDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _context.Comments
                    .Where(x => x.Post.Id == request.PostId)
                    .OrderByDescending(x => x.CreatedAt)
                    .ProjectTo<CommentDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<CommentDTO>>.Success(comments);
            }
        }
    }
}