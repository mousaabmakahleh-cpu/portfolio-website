FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY PortfolioApi/PortfolioApi.csproj PortfolioApi/
RUN dotnet restore PortfolioApi/PortfolioApi.csproj
COPY . .
RUN dotnet publish PortfolioApi/PortfolioApi.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000
ENTRYPOINT ["dotnet", "PortfolioApi.dll"]