import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'models/weather_model.dart';
import 'services/weather_api.dart';
import 'widgets/search_bar.dart';
import 'widgets/current_weather.dart';
import 'widgets/history_chart.dart';
import 'widgets/forecast_weather.dart';
import 'widgets/recent_searches.dart';

void main() {
  runApp(const AtmosphereApp());
}

class AtmosphereApp extends StatelessWidget {
  const AtmosphereApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Atmosphere Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Inter',
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const WeatherHomeScreen(),
    );
  }
}

class WeatherHomeScreen extends StatefulWidget {
  const WeatherHomeScreen({super.key});

  @override
  State<WeatherHomeScreen> createState() => _WeatherHomeScreenState();
}

class _WeatherHomeScreenState extends State<WeatherHomeScreen> {
  WeatherData? _weather;
  List<ForecastData>? _forecast;
  HistoryData? _history;
  List<WeatherData> _recentSearches = [];

  bool _isLoading = false;
  String? _errorMsg;

  @override
  void initState() {
    super.initState();
    _loadRecentSearches();
  }

  Future<void> _loadRecentSearches() async {
    final prefs = await SharedPreferences.getInstance();
    final String? savedData = prefs.getString('weatherRecentSearches');
    if (savedData != null) {
      try {
        final List decoded = jsonDecode(savedData);
        setState(() {
          _recentSearches = decoded
              .map((e) => WeatherData.fromJson(e))
              .toList();
        });
      } catch (e) {
        debugPrint('Failed to load recent searches: $e');
      }
    }
  }

  Future<void> _saveRecentSearch(WeatherData weatherData) async {
    // Remove if exists to push to front
    _recentSearches.removeWhere((item) => item.id == weatherData.id);
    _recentSearches.insert(0, weatherData);
    if (_recentSearches.length > 5) {
      _recentSearches = _recentSearches.sublist(0, 5);
    }

    final prefs = await SharedPreferences.getInstance();
    final String encoded = jsonEncode(
      _recentSearches.map((e) => e.toJson()).toList(),
    );
    await prefs.setString('weatherRecentSearches', encoded);

    setState(() {});
  }

  Future<void> _handleSearch(String cityName) async {
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    try {
      final geoData = await WeatherApi.fetchCoordinatesByCity(cityName);
      final weatherData = await WeatherApi.fetchWeatherByCoordinates(
        geoData.lat,
        geoData.lon,
      );
      final forecastData = await WeatherApi.fetchForecastByCoordinates(
        geoData.lat,
        geoData.lon,
      );
      final historyData = await WeatherApi.fetchHistoricalWeather(
        geoData.lat,
        geoData.lon,
      );

      setState(() {
        _weather = weatherData;
        _forecast = forecastData;
        _history = historyData;
      });

      await _saveRecentSearch(weatherData);
    } catch (e) {
      setState(() {
        _errorMsg = e.toString().contains('Exception:')
            ? e.toString().split('Exception: ').last
            : 'Failed to fetch weather data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0f172a), // Slate 900
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xff312e81), // Indigo 900
              Color(0xff0c4a6e), // Sky 900
              Color(0xff0f172a), // Slate 900
            ],
          ),
        ),
        child: SafeArea(
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 24,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Header
                      const Center(
                        child: Text(
                          'Atmosphere',
                          style: TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: -1,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Center(
                        child: Text(
                          'Discover real-time weather and forecasts.',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.blue[200],
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Search Bar
                      CustomSearchBar(onSearch: _handleSearch),
                      const SizedBox(height: 24),

                      // Global Error State
                      if (_errorMsg != null)
                        Container(
                          margin: const EdgeInsets.only(bottom: 24),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.redAccent.withOpacity(0.2),
                            border: Border.all(
                              color: Colors.redAccent.withOpacity(0.5),
                            ),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(
                            child: Text(
                              _errorMsg!,
                              style: const TextStyle(color: Colors.redAccent),
                            ),
                          ),
                        ),

                      // Loading State
                      if (_isLoading)
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 48),
                          child: Center(
                            child: CircularProgressIndicator(
                              color: Colors.blue,
                            ),
                          ),
                        ),

                      // Empty State
                      if (!_isLoading &&
                          _weather == null &&
                          _errorMsg == null &&
                          _recentSearches.isEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 60),
                          child: Center(
                            child: Container(
                              padding: const EdgeInsets.all(32),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(30),
                                border: Border.all(
                                  color: Colors.white.withOpacity(0.1),
                                ),
                              ),
                              child: Column(
                                children: [
                                  const Text(
                                    '🌦️',
                                    style: TextStyle(fontSize: 64),
                                  ),
                                  const SizedBox(height: 16),
                                  const Text(
                                    'Ready to explore?',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Enter a city name above to get detailed weather.',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.white.withOpacity(0.6),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                      // Main Weather Content
                      if (!_isLoading && _weather != null) ...[
                        CurrentWeatherWidget(weather: _weather!),
                        const SizedBox(height: 24),
                        if (_history != null)
                          HistoryChartWidget(history: _history!),
                        const SizedBox(height: 24),
                        if (_forecast != null)
                          ForecastWeatherWidget(forecast: _forecast!),
                        const SizedBox(height: 24),
                      ],

                      // Recent Searches
                      if (_recentSearches.isNotEmpty)
                        RecentSearchesWidget(
                          searches: _recentSearches,
                          onSelect: _handleSearch,
                        ),

                      const SizedBox(height: 48), // Bottom padding
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
