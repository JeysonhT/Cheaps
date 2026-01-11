import 'package:cheaps/db/database_helper.dart';
import 'package:cheaps/models/payments.dart';
import 'package:cheaps/providers/interfaces/payments_repository.dart';
import 'package:flutter/cupertino.dart';

class PaymentsProvider extends ChangeNotifier implements PaymentsRepository {
  List<Payments> _payments = [];

  List<Payments> get payments => _payments;

  @override
  Future<void> getPayments(int idConcept) async {
    final db = await DatabaseHelper.instance.database;

    List data = await db.query(
      'payments',
      where: 'id_concept = ?',
      whereArgs: [idConcept],
    );

    _payments = data.map((data) => Payments.fromMap(data)).toList();

    notifyListeners();
  }

  @override
  void savePayments(Payments pay, int idConcept) async {
    final db = await DatabaseHelper.instance.database;

    await db.insert('payments', pay.toMap());

    await getPayments(idConcept);
  }
}
