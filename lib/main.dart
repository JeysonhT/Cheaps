import 'package:cheaps/providers/services/concept_provider.dart';
import 'package:cheaps/providers/services/seller_provider.dart';
import 'package:cheaps/ui/ui_colors.dart';
import 'package:cheaps/ui/views/add_concept.dart';
import 'package:cheaps/ui/views/homepage.dart';
import 'package:cheaps/ui/views/add_sellers.dart';
import 'package:cheaps/ui/views/seller_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => SellerProvider()..getSellers()),
        ChangeNotifierProvider(create: (_) => ConceptProvider()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Cheaps',
        initialRoute: '/',
        routes: {
          '/': (context) => MyHomePage(title: 'Mis deudas'),
          'addSeller': (context) => AddSellers(title: "Añadir vendedor"),
          'sellerPage': (context) =>
              SellerPage(title: 'Deudas con el vendedor'),
          'addConcept': (context) =>
              AddConcept(title: "Añadir concepto de deuda"),
        },
        theme: ThemeData(colorScheme: .fromSeed(seedColor: UiColors.mauve)),
      ),
    );
  }
}
