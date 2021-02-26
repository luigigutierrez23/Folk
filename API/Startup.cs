using API.Extensions;
using Application.Posts;
using API.Middleware;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using API.SignalR;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
                //Add Fluent Validation
                .AddFluentValidation(config =>
                {
                    config.RegisterValidatorsFromAssemblyContaining<Create>();
                });

            services.AddApplicationServices(_configuration);
            services.AddIdentityServices(_configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt => opt.NoReferrer());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
            app.UseXfo(opt => opt.Deny());
            app.UseCsp(opt => opt
                .BlockAllMixedContent()
                .StyleSources(s => s.Self()
                    .CustomSources(
                        "https://fonts.googleapis.com",
                        "sha256-wkAU1AW/h8YFx0XlzvpTllAKnFEO2tw8aKErs5a26LY=",
                        "sha256-2aahydUs+he2AO0g7YZuG67RGvfE9VXGbycVgIwMnBI="
                ))
                .FontSources(s => s.Self()
                    .CustomSources(
                        "https://fonts.gstatic.com",
                        "data:"
                    ))
                .FormActions(s => s.Self())
                .FrameAncestors(s => s.Self())
                .ImageSources(s => s.Self()
                    .CustomSources(
                        "https://res.cloudinary.com",
                        "https://www.facebook.com",
                        "https://platform-lookaside.fbsbx.com",
                        "data:",
                        "blob:"
                ))
                .ScriptSources(s => s.Self()
                    .CustomSources(
                        "sha256-0aldtFvXGaO4rLYjFWef78J6Wa3w+BYWHT0NKQg5od0=",
                        "https://connect.facebook.net",
                        "sha256-QnTujQNM6zz5a+vXzOGWBMe19H3eroBwYX6Zf8Zrm2U=",
                        "sha256-7z3+LAX0mHkYYD8jnzPIhTAVKmE7cPVTYVAT9sxJmO4=",
                        "sha256-CzYN5MMT8wA9fbIe+4hC2BQ8qaszoPPdWMDLwuEJDcM=",
                        "sha256-Tui7QoFlnLXkJCSl1/JvEZdIXTmBttnWNxzJpXomQjg=",
                        "sha256-Gt3BPuPmOw7RP8QnhA34VChGZH90T/c7EvrHqoyZ35o=",
                        "sha256-yAuGcVFwPzeOfLAVg5D5Dl5ekhtC6Ppc3Q76vCarbxA=",
                        "sha256-0tOHBvatcojG9GVHxHZXbbL7Ey5JtaCQxQ0Td6ZaR0w=",
                        "sha256-IkJn6drnSmEDEqksTEX+Qwazt4wmUyuUCzG7RgSAWMs="
                    ))
            );


            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }
            else
            {
                app.Use(async (context, next) => 
                {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
                    await next.Invoke();
                });
            }

            app.UseRouting();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
                endpoints.MapFallbackToController("Index","Fallback");
            });
        }
    }
}
