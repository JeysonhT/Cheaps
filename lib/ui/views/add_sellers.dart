import 'package:cheaps/ui/components/seller_form.dart';
import 'package:flutter/material.dart';

class AddSellers extends StatelessWidget {
  const AddSellers({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Padding(
          padding: EdgeInsetsGeometry.fromLTRB(10, 10, 10, 0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            spacing: 10,
            children: [
              Image(
                image: AssetImage('assets/gatopunio.jpg'),
                width: 256,
                height: 256,
              ),
              const SellerForm(),
            ],
          ),
        ),
      ),
    );
  }
}
