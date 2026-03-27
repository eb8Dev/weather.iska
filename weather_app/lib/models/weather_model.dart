class WeatherData {
  final int id;
  final String cityName;
  final String country;
  final double temp;
  final double feelsLike;
  final int humidity;
  final double windSpeed;
  final int visibility;
  final String description;
  final String icon;

  WeatherData({
    required this.id,
    required this.cityName,
    required this.country,
    required this.temp,
    required this.feelsLike,
    required this.humidity,
    required this.windSpeed,
    required this.visibility,
    required this.description,
    required this.icon,
  });

  factory WeatherData.fromJson(Map<String, dynamic> json) {
    return WeatherData(
      id: json['id'] ?? 0,
      cityName: json['name'] ?? 'Unknown',
      country: json['sys']?['country'] ?? '',
      temp: (json['main']['temp'] ?? 0).toDouble(),
      feelsLike: (json['main']['feels_like'] ?? 0).toDouble(),
      humidity: json['main']['humidity'] ?? 0,
      windSpeed: (json['wind']['speed'] ?? 0).toDouble(),
      visibility: json['visibility'] ?? 0,
      description: json['weather']?[0]?['description'] ?? '',
      icon: json['weather']?[0]?['icon'] ?? '01d',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': cityName,
      'sys': {'country': country},
      'main': {
        'temp': temp,
        'feels_like': feelsLike,
        'humidity': humidity,
      },
      'wind': {'speed': windSpeed},
      'visibility': visibility,
      'weather': [
        {'description': description, 'icon': icon}
      ]
    };
  }
}

class ForecastData {
  final DateTime date;
  final double temp;
  final String description;
  final String icon;

  ForecastData({
    required this.date,
    required this.temp,
    required this.description,
    required this.icon,
  });

  factory ForecastData.fromJson(Map<String, dynamic> json) {
    return ForecastData(
      date: DateTime.fromMillisecondsSinceEpoch((json['dt'] ?? 0) * 1000),
      temp: (json['main']['temp'] ?? 0).toDouble(),
      description: json['weather']?[0]?['description'] ?? '',
      icon: json['weather']?[0]?['icon'] ?? '01d',
    );
  }
}

class HistoryData {
  final List<DateTime> times;
  final List<double> temperatures;

  HistoryData({required this.times, required this.temperatures});

  factory HistoryData.fromJson(Map<String, dynamic> json) {
    final timesStr = List<String>.from(json['hourly']['time'] ?? []);
    final temps = List<double>.from((json['hourly']['temperature_2m'] ?? []).map((x) => (x as num).toDouble()));
    
    return HistoryData(
      times: timesStr.map((e) => DateTime.parse(e)).toList(),
      temperatures: temps,
    );
  }
}

class GeoData {
  final String name;
  final double lat;
  final double lon;

  GeoData({required this.name, required this.lat, required this.lon});

  factory GeoData.fromJson(Map<String, dynamic> json) {
    return GeoData(
      name: json['name'] ?? '',
      lat: (json['lat'] ?? 0).toDouble(),
      lon: (json['lon'] ?? 0).toDouble(),
    );
  }
}
