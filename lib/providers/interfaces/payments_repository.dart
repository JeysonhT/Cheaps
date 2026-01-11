import 'package:cheaps/models/payments.dart';

abstract interface class PaymentsRepository {
  Future<void> getPayments(int idConcept);

  void savePayments(Payments pay, int idConcept);
}
