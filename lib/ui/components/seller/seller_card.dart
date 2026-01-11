import 'package:cheaps/providers/services/seller_provider.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../models/seller.dart';

class SellerCard extends StatelessWidget {
  const SellerCard({super.key, required this.seller});

  final Seller seller;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SellerProvider>();
    return Card(
      color: UiColors.icyBlue,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: Icon(Icons.person),
            title: Text(seller.name, style: TextStyle(fontSize: 25)),
            subtitle: Text(seller.phoneNumber!, style: TextStyle(fontSize: 15)),
            onTap: () => Navigator.pushNamed(
              context,
              'sellerPage',
              arguments: seller.id,
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              IconButton(
                onPressed: () => provider.deleteSeller(seller.id!),
                icon: Icon(Icons.delete_forever, color: Colors.red),
                tooltip: 'Borrar vendedor',
              ),
            ],
          ),
        ],
      ),
    );
  }
}
