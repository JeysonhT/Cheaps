import 'package:cheaps/providers/services/seller_provider.dart';
import 'package:cheaps/ui/components/seller_form.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../models/seller.dart';

class SellerFormState extends State<SellerForm> {
  final _formKey = GlobalKey<FormState>();

  final nameController = TextEditingController();
  final phoneNumberController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SellerProvider>();
    return Form(
      key: _formKey,
      child: Column(
        spacing: 10,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'Es importante para tus finanzas personales saber cuanto debes',
            overflow: TextOverflow.fade,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 25,
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
          TextFormField(
            controller: nameController,
            maxLines: 1,
            keyboardType: TextInputType.name,
            validator: (value) {
              if (value == null || value.isEmpty || value.length < 3) {
                return 'ingrese un nombre valido';
              }
              return null;
            },
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              label: Text('Ingrese el nombre del vendedor'),
              contentPadding: EdgeInsets.all(5),
            ),
          ),
          TextFormField(
            controller: phoneNumberController,
            maxLines: 1,
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'ingrese un valor de precio valido';
              }

              return null;
            },
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              label: Text('Ingrese el numero de telefono del vendedor'),
            ),
          ),
          ElevatedButton(
            onPressed: () => {
              if (nameController.text.isNotEmpty &&
                  phoneNumberController.text.isNotEmpty)
                {
                  provider.saveSeller(
                    Seller(
                      name: nameController.text,
                      phoneNumber: phoneNumberController.text,
                    ),
                  ),
                  nameController.clear(),
                  phoneNumberController.clear(),
                  _showMessage(context),
                },
            },
            style: ElevatedButton.styleFrom(
              minimumSize: Size(250, 40),
              backgroundColor: UiColors.frostedMint,
              textStyle: TextStyle(color: Colors.black, fontSize: 20),
            ),
            child: Text('Guardar'),
          ),
          Text(
            'disclamer: los gastos relacionados se guardan por separado desde los vendedores',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.black38),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    nameController.dispose();
    phoneNumberController.dispose();
    super.dispose();
  }

  void _showMessage(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('datos guardados'),
        duration: const Duration(microseconds: 1500),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        action: SnackBarAction(
          label: 'OK!',
          onPressed: () => Navigator.pop(context),
        ),
      ),
    );
  }
}
