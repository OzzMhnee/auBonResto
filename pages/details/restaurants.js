const restaurants = [
    {
        id: "chezVincent",
        imgLogoAlpha: "/images/chezVincent/logoAlpha.png",
        //carrousel
        imgCarrousel1: "/images/chezVincent/carrousel1.png",
        imgCarrousel2: "/images/chezVincent/carrousel2.png",
        imgCarrousel3: "/images/chezVincent/carrousel3.png",
        //Section Booking
        titleBooking: "Découvrir le restaurant Chez Vincent",
        pBooking: 'Situé à Bègles, près de Bordeaux, « Chez Vincent » offre un cadre  chaleureux pour savourer une cuisine traditionnelle faite de produits  frais. Profitez d’un repas agréable au coin de la cheminée ou sur la  terrasse ombragée. Chez Vincent offre une variété de vins, spiritueux et alcools de qualité pour accompagner vos repas ou enrichir votre soirée. La sélection  inclut des vins régionaux, grands crus et champagnes. Idéal pour une  expérience culinaire mémorable, que ce soit pour un dîner intime, une  célébration entre amis ou un évènement professionnel. Un parcours culinaire autour des meilleures saveurs du Sud-Ouest.',
        // popUp <------------------------------------------------------------------------
        // Section Menu
        imgCategory1: "/images/chezVincent/category1.png",
        titreCategory1: "Entrées",
        imgCategory2: "/images/chezVincent/category2.png",
        titreCategory2: 'Côté "Mer"',
        imgCategory3: "/images/chezVincent/category3.png",
        titreCategory3: 'Côté "Terre"',
        imgCategory4: "/images/chezVincent/category4.png",
        titreCategory4: 'Desserts',
        imgMoreInfo1: "/images/chezVincent/moreInfo1.png",
        imgMoreInfo2: "/images/chezVincent/moreInfo2.png",
        // Detail Menu Catégory 1
        cat1firstColumnPrice: "12 €<br>12 €<br>14 €<br>14 €<br><br><br>15 €<br>15 €<br>15 €<br>15 €<br>15 €",
        cat1firstColumnPlat: "Accras de morue<br>Soupe de poissons<br>Salade de gésiers<br>Salade Vincent<br><span>&nbsp;&nbsp;&nbsp;&nbsp;(Salade, saumon, morue, œufs,<br>&nbsp;&nbsp;&nbsp;&nbsp;tomates et sauce vodka)</span><br>6 huîtres saucisses<br>Buffet de hors d’œuvre<br>Jambon blanc Italien truffé<br>Pala de charcuterie<br>Dégustation de saumon mariné",
        cat1secondColumnPrice: "18 €<br>20 €<br><br><br>20 €<br><br>20 €<br>20 €<br>20 €<br>20 €<br>24 €",
        cat1secondColumnPlat: "Saumon fumé et sa vodka<br>Assiette Périgourdine <br><span>&nbsp;&nbsp;&nbsp;&nbsp;(Foie, gésiers, salade, tomates,<br>&nbsp;&nbsp;&nbsp;&nbsp;oeufs et champignons)</span><br>Duo de foie gras<br><span>&nbsp;&nbsp;&nbsp;&nbsp;(nature et Banyuls)</span><br>Gambas flambées au whisky<br>Notre papillote de foie gras<br>Omelette aux cèpes<br>Véritable salade César<br>12 huîtres saucisses",
        // Detail Menu Catégory 2 
        cat2firstColumnPrice: "14 €<br>20 €<br>20 €<br>20 €<br>24 €<br><br>26 €",
        cat2firstColumnPlat: "Brandade primée à la fête de la morue<br>Dos de morue à l’ail<br>Dos de morue à l’Espagnole<br>Dos de morue à la Norvégienne<br>Gambas flambées<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(à la crème de Whisky)</span><br>Brochette de Saumon & Saint-Jacques",
        cat2secondColumnPrice: "26 €<br>28 €<br>28 €<br>28 €<br><br>28 €<br>28 €",
        cat2secondColumnPlat: "Saint-Jacques au Lillet<br>Assiette de dégustation, trio de morue<br>Lamproie à la Bordelaise<br>Papillote de gambas décortiquées<br>&nbsp;&nbsp;&nbsp;&nbsp;& Saint-Jacques au foie gras<br>Parillada de poissons<br>Thon rouge spécial sushi snacké au sésame",
        // Detail Menu Catégory 3
        cat3firstColumnPrice: "14 €<br>15 €<br>16 €<br>16 €<br><br>16 €<br>18 €<br><br>20 €<br>20 €<br><br>20 €",
        cat3firstColumnPlat: "Filet de poulet fermier à la crème<br>Bavette à l’échalotte<br>Andouillette ou boudin au grill<br>Brochette de magret à l’ananas<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(Ventrèche)</span><br>Confit de canard du Sud-Ouest<br>Brochette de boeuf<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(Champignons, oignons)</span><br>Hamburger du chef au Charolais<br>Plaisir du Périgord<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(Confit de canard, foie gras, cèpes, purée)</span><br>Steak tartare au couteau",
        cat3secondColumnPrice: "22 €<br>22 €<br><br>22 €<br>24 €<br>24 €<br><br>28 €<br>34 €<br><br>88 €",
        cat3secondColumnPlat: "Carré d’agneau au romarin<br>Côtelettes d’agneau<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(4 pièces)</span><br>Magret de canard grillé entier<br>Côte de veau Normande<br>Entrecôte de bœuf<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(400 gr)</span><br>Hamburger Périgourdin<br>Côte de bœuf<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(1 pers – 700 gr)</span><br>Côte de bœuf Rossini du chef<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(2 pers – 1400 gr)</span>",
        // Detail Menu Catégory 4
        cat4firstColumnPrice: "8 €<br>8 €<br>8 €<br>8 €<br>8 €<br>8 €<br>8 €<br>8 €<br>8 €<br>8 €<br>8 €",
        cat4firstColumnPlat: "6 Cannelés maison<br>Chocolat ou café Liégeois<br>Coupe Colonel<br>Crème Catalane<br>Demi-ananas frais<br>Fondant au chocolat<br>Ile flottante<br>Mini baba au rhum<br>Nougat glacé<br>Omelette Norvégienne maison<br>Profiteroles maison",
        cat4secondColumnPrice: "8 €<br><br>8 €<br><br>8 €<br><br>10 €<br><br>10 €",
        cat4secondColumnPlat: "Trois boules de glaces<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(vanille, café, chocolat, rhum raisin, fraise et menthe)</span><br>Trois boules de sorbet<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(citron, framboise, poire, cassis, pomme, passion)</span><br>Assiette de fromages<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(penser au vin !)</span><br>Palette de desserts<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(hors menu)</span><br>Café ou thé gourmands<br>&nbsp;&nbsp;&nbsp;&nbsp;<span>(hors menus)</span>",
        //Section MoreInfo
        titreMoreInfo1: "Besoin d'un traiteur pour une occasion spéciale ?<br>Notre service traiteur saura vous satisfaire à vos besoin !<br>Devis sur demande",
        imgMoreInfo1: "/images/chezVincent/moreInfo1.png",
        titreMoreInfo2: "La sélection inclut des vins régionaux, grands crus et champagnes. <br>Idéal pour une  expérience culinaire mémorable, que ce soit pour un dîner intime, une  célébration entre amis ou un évènement professionnel.",
        imgMoreInfo2: "/images/chezVincent/moreInfo2.png",
        //Section Avis
        comment1: "Un repas succulent !<br>Nous y retournerons !",
        comment1autor: "Bakugo",
        comment1autorImg: "/images/general/Avatar1.png",
        comment2: "Un merveilleux repas d'entreprise",
        comment2autor: "Yuki",
        comment2autorImg: "/images/general/Avatar2.png",
        comment3: "Succulent",
        comment3autor: "Denji",
        comment3autorImg: "/images/general/Avatar3.png",
        map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d22648.79868028827!2d-0.567171!3d44.799154!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd55271c42176583%3A0x3781fb1f45d67bda!2sChez%20Vincent!5e0!3m2!1sfr!2sfr!4v1748950028020!5m2!1sfr!2sfr",
        contact: "38 rue Vincent Gonzales<br>33130 - Bègles<br><br>05 56 49 01 45",
        facebook: "/images/general/iconFacebook.png",
        instagram: "/images/general/iconInstagram.png",
        linkedin: "/images/general/iconLinkedin.png",
        youtube: "/images/general/iconYoutube.png",
    }
]



