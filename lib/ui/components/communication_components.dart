import 'package:flutter/material.dart';

class CommunicationComponents {
  void showMessage(
    BuildContext context,
    String message,
    VoidCallback callback,
  ) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(microseconds: 1500),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        action: SnackBarAction(label: 'OK!', onPressed: callback),
      ),
    );
  }
}
