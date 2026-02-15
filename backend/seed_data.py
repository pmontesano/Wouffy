import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

mock_walkers = [
    {
        "walker_id": "walker_001",
        "user_id": "user_walker_001",
        "display_name": "María González",
        "photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        "bio": "Amante de los perros con 5 años de experiencia. Especializada en razas grandes y entrenamiento básico.",
        "experience_years": 5,
        "service_area_text": "Palermo, Recoleta, Belgrano",
        "base_location_text": "Palermo, Buenos Aires",
        "price_per_hour": 800,
        "rating_avg": 4.8,
        "rating_count": 47,
        "availability_days": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
        "availability_hours": "9:00 - 18:00",
        "latitude": -34.5889,
        "longitude": -58.4194,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "walker_id": "walker_002",
        "user_id": "user_walker_002",
        "display_name": "Carlos Fernández",
        "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        "bio": "Paseador profesional certificado. Me encantan los paseos largos y las aventuras al aire libre.",
        "experience_years": 3,
        "service_area_text": "Caballito, Almagro, Villa Crespo",
        "base_location_text": "Caballito, Buenos Aires",
        "price_per_hour": 700,
        "rating_avg": 4.9,
        "rating_count": 62,
        "availability_days": ["Lunes", "Miércoles", "Viernes", "Sábado", "Domingo"],
        "availability_hours": "8:00 - 20:00",
        "latitude": -34.6158,
        "longitude": -58.4333,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "walker_id": "walker_003",
        "user_id": "user_walker_003",
        "display_name": "Laura Pérez",
        "photo_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        "bio": "Veterinaria y paseadora. Conocimientos en primeros auxilios y cuidado especial de mascotas.",
        "experience_years": 7,
        "service_area_text": "Núñez, Belgrano, Colegiales",
        "base_location_text": "Núñez, Buenos Aires",
        "price_per_hour": 1000,
        "rating_avg": 5.0,
        "rating_count": 89,
        "availability_days": ["Martes", "Jueves", "Sábado"],
        "availability_hours": "10:00 - 17:00",
        "latitude": -34.5436,
        "longitude": -58.4515,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "walker_id": "walker_004",
        "user_id": "user_walker_004",
        "display_name": "Javier Morales",
        "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "bio": "Paseador joven y energético. Perfecto para perros activos que necesitan mucho ejercicio.",
        "experience_years": 2,
        "service_area_text": "San Telmo, Puerto Madero, Monserrat",
        "base_location_text": "San Telmo, Buenos Aires",
        "price_per_hour": 650,
        "rating_avg": 4.7,
        "rating_count": 34,
        "availability_days": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        "availability_hours": "7:00 - 19:00",
        "latitude": -34.6217,
        "longitude": -58.3724,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "walker_id": "walker_005",
        "user_id": "user_walker_005",
        "display_name": "Ana Martínez",
        "photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        "bio": "Especialista en razas pequeñas. Paseos tranquilos y cuidado personalizado para cachorros.",
        "experience_years": 4,
        "service_area_text": "Recoleta, Barrio Norte, Retiro",
        "base_location_text": "Recoleta, Buenos Aires",
        "price_per_hour": 750,
        "rating_avg": 4.9,
        "rating_count": 71,
        "availability_days": ["Lunes", "Miércoles", "Viernes", "Domingo"],
        "availability_hours": "9:00 - 16:00",
        "latitude": -34.5875,
        "longitude": -58.3974,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "walker_id": "walker_006",
        "user_id": "user_walker_006",
        "display_name": "Diego Sánchez",
        "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        "bio": "Ex-entrenador canino profesional. Paseos educativos con refuerzo positivo.",
        "experience_years": 8,
        "service_area_text": "Palermo, Villa Crespo, Colegiales",
        "base_location_text": "Palermo Hollywood, Buenos Aires",
        "price_per_hour": 950,
        "rating_avg": 4.8,
        "rating_count": 103,
        "availability_days": ["Martes", "Jueves", "Sábado", "Domingo"],
        "availability_hours": "8:00 - 18:00",
        "latitude": -34.5897,
        "longitude": -58.4253,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "walker_id": "walker_007",
        "user_id": "user_walker_007",
        "display_name": "Sofía Ramírez",
        "photo_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
        "bio": "Amante de los animales. Trabajo desde casa y puedo ofrecer horarios flexibles.",
        "experience_years": 3,
        "service_area_text": "Flores, Floresta, Parque Chacabuco",
        "base_location_text": "Flores, Buenos Aires",
        "price_per_hour": 600,
        "rating_avg": 4.6,
        "rating_count": 28,
        "availability_days": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        "availability_hours": "8:00 - 20:00",
        "latitude": -34.6283,
        "longitude": -58.4641,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "walker_id": "walker_008",
        "user_id": "user_walker_008",
        "display_name": "Martín Torres",
        "photo_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop",
        "bio": "Corredor aficionado. Ideal para perros que necesitan ejercicio intenso y running.",
        "experience_years": 2,
        "service_area_text": "Belgrano, Núñez, Coghlan",
        "base_location_text": "Belgrano, Buenos Aires",
        "price_per_hour": 850,
        "rating_avg": 4.7,
        "rating_count": 41,
        "availability_days": ["Lunes", "Miércoles", "Viernes", "Sábado"],
        "availability_hours": "6:00 - 11:00, 18:00 - 21:00",
        "latitude": -34.5627,
        "longitude": -58.4566,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "walker_id": "walker_009",
        "user_id": "user_walker_009",
        "display_name": "Valentina López",
        "photo_url": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
        "bio": "Estudiante de veterinaria. Cariñosa y responsable con años de experiencia familiar.",
        "experience_years": 4,
        "service_area_text": "Villa Urquiza, Villa Pueyrredón, Saavedra",
        "base_location_text": "Villa Urquiza, Buenos Aires",
        "price_per_hour": 550,
        "rating_avg": 4.8,
        "rating_count": 52,
        "availability_days": ["Lunes", "Martes", "Jueves", "Domingo"],
        "availability_hours": "14:00 - 20:00",
        "latitude": -34.5711,
        "longitude": -58.4875,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "walker_id": "walker_010",
        "user_id": "user_walker_010",
        "display_name": "Roberto Díaz",
        "photo_url": "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop",
        "bio": "Jubilado con mucho tiempo libre. Paseos relajados y compañía para perros mayores.",
        "experience_years": 6,
        "service_area_text": "San Cristóbal, Boedo, Parque Patricios",
        "base_location_text": "Boedo, Buenos Aires",
        "price_per_hour": 500,
        "rating_avg": 5.0,
        "rating_count": 96,
        "availability_days": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
        "availability_hours": "9:00 - 17:00",
        "latitude": -34.6345,
        "longitude": -58.4177,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_walkers():
    print("🌱 Iniciando seed de datos...")
    
    # Limpiar colección existente de walkers
    await db.walker_profiles.delete_many({})
    print("✅ Colección walker_profiles limpiada")
    
    # Insertar walkers mock
    result = await db.walker_profiles.insert_many(mock_walkers)
    print(f"✅ {len(result.inserted_ids)} walkers insertados correctamente")
    
    print("🎉 Seed completado!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_walkers())
