import 'package:cheaps/db/database_helper.dart';
import 'package:cheaps/models/seller.dart';
import 'package:cheaps/providers/interfaces/seller_repository.dart';
import 'package:flutter/material.dart';

class SellerProvider extends ChangeNotifier implements SellerRepository{
  List<Seller> _sellers = [];
  List<Seller> get sellers => _sellers;

  @override
  void deleteSeller(int id) async {
    final db = await DatabaseHelper.instance.database;
    await db.delete('seller', where: 'id = ?', whereArgs: [id]);
    await getSellers();
  }

  @override
  Future<void> getSellers() async {
    final db = await DatabaseHelper.instance.database;

    final listSeller = await db.query('seller');

    _sellers = listSeller.map((map) => Seller.fromMap(map)).toList();
    notifyListeners();
  }

  @override
  void saveSeller(Seller s) async {
    final db = await DatabaseHelper.instance.database;

    await db.insert('seller', s.toMap());
    await getSellers();
  }

  @override
  Future<dynamic> updateSeller(Seller s) {
    // TODO: implement updateSeller
    throw UnimplementedError();
  }
}
