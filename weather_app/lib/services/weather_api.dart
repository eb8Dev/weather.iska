import 'dart:convert';
import 'package:http/http.dart' as http;
import '../env.dart';
import '../models/weather_model.dart';

class WeatherApi {
  static const String _baseUrl = 'https://api.openweathermap.org/data/2.5';
  static const String _geoUrl = 'https://api.openweathermap.org/geo/1.0';

  static String _parseError(http.Response res, String fallback) {
    try {
      final json = jsonDecode(res.body);
      return json['message']?.toString() ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  static Future<WeatherData> fetchWeatherByCoordinates(double lat, double lon) async {
    if (Env.openWeatherApiKey.isEmpty || Env.openWeatherApiKey == 'YOUR_API_KEY_HERE') {
      throw Exception('OpenWeatherMap API Key is missing. Please add it to env.dart');
    }
    final res = await http.get(Uri.parse('$_baseUrl/weather?lat=$lat&lon=$lon&appid=${Env.openWeatherApiKey}&units=metric'));
    if (res.statusCode != 200) throw Exception(_parseError(res, 'Failed to fetch weather data'));
    return WeatherData.fromJson(jsonDecode(res.body));
  }

  static Future<List<ForecastData>> fetchForecastByCoordinates(double lat, double lon) async {
    if (Env.openWeatherApiKey.isEmpty || Env.openWeatherApiKey == 'YOUR_API_KEY_HERE') {
      throw Exception('OpenWeatherMap API Key is missing. Please add it to env.dart');
    }
    final res = await http.get(Uri.parse('$_baseUrl/forecast?lat=$lat&lon=$lon&appid=${Env.openWeatherApiKey}&units=metric'));
    if (res.statusCode != 200) throw Exception(_parseError(res, 'Failed to fetch forecast data'));
    
    final data = jsonDecode(res.body);
    final List list = data['list'];
    
    // Filter to one per day (~noon)
    return list
        .where((item) => (item['dt_txt'] as String).contains('12:00:00'))
        .map((item) => ForecastData.fromJson(item))
        .take(5)
        .toList();
  }

  static Future<GeoData> fetchCoordinatesByCity(String cityName) async {
    if (Env.openWeatherApiKey.isEmpty || Env.openWeatherApiKey == 'YOUR_API_KEY_HERE') {
      throw Exception('OpenWeatherMap API Key is missing. Please add it to env.dart');
    }
    final res = await http.get(Uri.parse('$_geoUrl/direct?q=$cityName&limit=1&appid=${Env.openWeatherApiKey}'));
    if (res.statusCode != 200) throw Exception(_parseError(res, 'Failed to fetch coordinates'));
    
    final List data = jsonDecode(res.body);
    if (data.isEmpty) throw Exception('City not found');
    return GeoData.fromJson(data[0]);
  }

  static Future<HistoryData> fetchHistoricalWeather(double lat, double lon) async {
    final today = DateTime.now();
    final endDate = today.toIso8601String().split('T')[0];
    
    final startDateObj = today.subtract(const Duration(days: 7));
    final startDate = startDateObj.toIso8601String().split('T')[0];

    final res = await http.get(Uri.parse(
        'https://archive-api.open-meteo.com/v1/archive?latitude=$lat&longitude=$lon&start_date=$startDate&end_date=$endDate&hourly=temperature_2m'));
    
    if (res.statusCode != 200) throw Exception('Failed to fetch historical weather');
    return HistoryData.fromJson(jsonDecode(res.body));
  }
}
