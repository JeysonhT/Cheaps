import 'package:cheaps/models/payments.dart';
import 'package:cheaps/providers/services/concept_provider.dart';
import 'package:cheaps/providers/services/payments_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../ui_colors.dart';

class PayDialog extends StatelessWidget {
  PayDialog({
    super.key,
    required this.idConcept,
    required this.mount,
    required this.idSeller,
  });

  final int idConcept;
  final double mount;
  final int idSeller;

  final payMount = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PaymentsProvider>();
    final conceptProvider = context.watch<ConceptProvider>();

    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: UiColors.mauve,
        foregroundColor: Colors.black,
        minimumSize: Size(350, 40),
      ),
      onPressed: () => showDialog(
        context: context,
        builder: (BuildContext context) => AlertDialog(
          title: Text('Ingresa la cantidad a pagar'),
          content: TextFormField(
            controller: payMount,
            keyboardType: TextInputType.numberWithOptions(decimal: true),
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              label: Text('Ejemplo: 500.0'),
            ),
            validator: (data) {
              if (data!.isEmpty) {
                return 'error el dato no puede estar vacio';
              } else if (double.parse(data) > mount) {
                return 'la cantidad a pagar no puede ser mayor';
              }
            },
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, 'Cancel'),
              child: Text('Cancelar'),
            ),
            TextButton(
              onPressed: () {
                if (payMount.text.isNotEmpty &&
                    double.parse(payMount.text) > 0.0) {
                  provider.savePayments(
                    Payments(
                      idConcept: idConcept,
                      pay: double.parse(payMount.text),
                      payAt: DateTime.now(),
                    ),
                    idConcept,
                  );
                  conceptProvider.updateConcept(
                    idConcept,
                    double.parse(payMount.text),
                    mount,
                    idSeller,
                  );
                }
                Navigator.pop(context, true);
              },
              child: const Text('Pagar cantidad'),
            ),
          ],
        ),
      ),
      child: Text('Realizar Pago', style: TextStyle(fontSize: 20)),
    );
  }
}
