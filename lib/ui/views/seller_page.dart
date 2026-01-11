import 'package:cheaps/providers/services/concept_provider.dart';
import 'package:cheaps/ui/components/concept/concept_card.dart';
import 'package:cheaps/ui/components/states/seller_page_state.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SellerPage extends StatefulWidget {
  const SellerPage({super.key, required this.title});

  final String title;

  @override
  State<SellerPage> createState() => SellerPageState();
}
