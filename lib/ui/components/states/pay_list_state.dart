import 'package:cheaps/ui/components/pay/pay_list.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../providers/services/payments_provider.dart';
import '../../ui_colors.dart';
import '../pay/pay_card.dart';

class PayListState extends State<PayList> {
  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PaymentsProvider>().getPayments(widget.idConcept);
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PaymentsProvider>();

    return (provider.payments.isNotEmpty)
        ? ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: provider.payments.length,
            itemBuilder: (context, index) {
              final p = provider.payments[index];
              return PayCard(pay: p);
            },
          )
        : Text('Aun no hay pagos', style: TextStyle(color: UiColors.babyPink));
  }
}
