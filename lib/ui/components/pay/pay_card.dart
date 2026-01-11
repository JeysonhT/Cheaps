import 'package:cheaps/models/payments.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:flutter/material.dart';

class PayCard extends StatelessWidget {
  const PayCard({super.key, required this.pay});

  final Payments pay;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      shadowColor: UiColors.babyPink,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ListTile(
            leading: Icon(
              Icons.arrow_downward_rounded,
              color: UiColors.babyPink,
            ),
            title: Text('Abono'),
            subtitle: Text(pay.payAt.toString().split(' ')[0]),
            trailing: Text(' C\$ ${pay.pay}', style: TextStyle(fontSize: 15)),
          ),
        ],
      ),
    );
  }
}
