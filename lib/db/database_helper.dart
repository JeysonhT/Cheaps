import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();

  DatabaseHelper._init();

  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;

    _database = await _initDB('cheaps.db');

    return _database!;
  }

  Future<Database> _initDB(String filepath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filepath);

    // if i want update the database,
    // i before create the update policy them change the version of database
    return await openDatabase(
      path,
      onCreate: _createDb,
      version: 2,
      onUpgrade: _updateDB,
    );
  }

  Future _createDb(Database db, int version) async {
    await db.execute('''
     CREATE TABLE seller(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone_number TEXT);
    CREATE TABLE concept(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
    concept TEXT,
    id_seller INTEGER,
    created_at DATE,
    init_total REAL,
    current_total REAL,
    FOREIGN KEY(id_seller) REFERENCES seller(id) ON DELETE CASCADE);
    ''');
  }

  Future _updateDB(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 3) {
      await db.execute('''
      ''');
    }
  }

  Future<void> close() async {
    final db = _database;
    if (db != null) {
      await db.close();
    }
  }
}
