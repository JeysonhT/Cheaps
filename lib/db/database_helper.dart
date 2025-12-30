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

    return await openDatabase(path, onCreate: _createDb, version: 1);
  }

  Future _createDb(Database db, int version) async {
    await db.execute('''
    CREATE TABLE seller(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT);
    CREATE TABLE concept(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
    concept TEXT,
    id_seller INTEGER,
    init_total REAL,
    current_total REAL,
    FOREIGN KEY(id_seller) REFERENCES seller(id) ON DELETE CASCADE)'
    '''
    );
  }

  Future<void> close() async {
    final db = _database;
    if (db != null) {
      await db.close();
    }
  }
}
