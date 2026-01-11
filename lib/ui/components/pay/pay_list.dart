import 'package:cheaps/providers/services/payments_provider.dart';
import 'package:cheaps/ui/components/pay/pay_card.dart';
import 'package:cheaps/ui/components/states/pay_list_state.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PayList extends StatefulWidget {
  const PayList({super.key, required this.idConcept});

  final int idConcept;

  @override
  State<PayList> createState() => PayListState();
}
