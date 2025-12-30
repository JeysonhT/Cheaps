import 'package:cheaps/models/seller.dart';

abstract interface class SellerRepository {
  Future<void> getSellers();
  void saveSeller(Seller s);
  Future updateSeller(Seller s);
  void deleteSeller(int id);
}
