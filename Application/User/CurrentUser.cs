using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<User> { }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserAccesor _userAccesor;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator,
            IUserAccesor userAccesor)
            {
                _userAccesor = userAccesor;
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
            }

        public async Task<User> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByNameAsync(_userAccesor.GetCurrentUsername());

            return new User
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Token = _jwtGenerator.CreateToken(user),
                Image = null,
            };
        }
    }
}
}