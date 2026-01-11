import 'package:cheaps/providers/services/seller_provider.dart';
import 'package:cheaps/ui/components/seller/seller_card.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SellerProvider>();
    return Scaffold(
      appBar: AppBar(
        title: Text(
          title,
          style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold),
        ),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: (provider.sellers.isEmpty)
          ? Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "Primero ingresa un vendedor",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 20, color: Colors.pinkAccent),
                ),
              ],
            )
          : Padding(
              padding: EdgeInsetsGeometry.all(10),
              child: ListView.builder(
                itemCount: provider.sellers.length,
                itemBuilder: (context, index) {
                  final seller = provider.sellers[index];
                  return SellerCard(seller: seller);
                },
              ),
            ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: UiColors.frostedMint,
        onPressed: () => Navigator.pushNamed(context, 'addSeller'),
        tooltip: 'agregar vendedor',
        child: Icon(Icons.add, color: Colors.black54),
      ),
    );
  }
}
