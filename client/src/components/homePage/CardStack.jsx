import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Bed, Users, DollarSign } from "lucide-react";

// Sample data with static colors
const initialCards = [
  {
    id: 1,
    title: "MAGNA COASTAL",
    subtitle: "Invest in Future",
    description:
      "An undiscovered coastal jewel on the Gulf of Aqaba near the Red Sea, Magna will be a place like nothing on earth.",
    imageUrl:
      "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2762&q=80",
    icon: "bed",
    colors: {
      primary: "#1a1a1a",
      secondary: "#333333",
      text: "#ffffff",
      shadow: "rgba(0, 0, 0, 0.5)",
    },
  },
  {
    id: 2,
    title: "AZURE RETREAT",
    subtitle: "Luxury Redefined",
    description:
      "Experience the pinnacle of coastal living with panoramic ocean views and world-class amenities.",
    imageUrl:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2760&q=80",
    icon: "users",
    colors: {
      primary: "#0f2b46",
      secondary: "#1e4976",
      text: "#ffffff",
      shadow: "rgba(15, 43, 70, 0.6)",
    },
  },
  {
    id: 3,
    title: "TERRA VISTA",
    subtitle: "Natural Harmony",
    description:
      "Nestled between mountains and sea, this sustainable development offers the perfect balance of luxury and nature.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2760&q=80",
    icon: "dollar",
    colors: {
      primary: "#e7000b",
      secondary: "#4a7a38",
      text: "#ffffff",
      shadow: "rgba(45, 74, 34, 0.6)",
    },
  },
  {
    id: 4,
    title: "SOLARIS HEIGHTS",
    subtitle: "Urban Innovation",
    description:
      "A revolutionary urban development that combines cutting-edge architecture with sustainable living solutions.",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2760&q=80",
    icon: "arrowUpRight",
    colors: {
      primary: "#5a3a31",
      secondary: "#8c5b4a",
      text: "#ffffff",
      shadow: "rgba(90, 58, 49, 0.6)",
    },
  },
  {
    id: 5,
    title: "MERIDIAN BAY",
    subtitle: "Coastal Excellence",
    description:
      "Where luxury meets the sea. Exclusive waterfront properties with private beaches and marina access.",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2760&q=80",
    icon: "bed",
    colors: {
      primary: "#1a3a5f",
      secondary: "#2d5f8a",
      text: "#ffffff",
      shadow: "rgba(26, 58, 95, 0.6)",
    },
  },
];

export default function CardStack() {
  const [cards, setCards] = useState(initialCards);

  const removeCard = (id) => {
    setCards((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      const maxId = Math.max(...prev.map((c) => c.id));
      const newCard = {
        ...prev[0],
        id: maxId + 1,
        title: `NEW PROPERTY ${maxId + 1}`,
        description:
          "A newly discovered property with unique features and amenities.",
        imageUrl: prev[maxId % prev.length].imageUrl,
        icon: ["bed", "users", "dollar", "arrowUpRight"][
          Math.floor(Math.random() * 4)
        ],
        colors: prev[0].colors,
      };
      return [...filtered, newCard];
    });
  };

  const getIconComponent = (icon) => {
    switch (icon) {
      case "bed":
        return <Bed className="h-5 w-5" />;
      case "users":
        return <Users className="h-5 w-5" />;
      case "dollar":
        return <DollarSign className="h-5 w-5" />;
      default:
        return <ArrowUpRight className="h-5 w-5" />;
    }
  };

  return (
    <div className="relative h-[400px] md:h-[400px] w-full md:w-[600px] ">
      <AnimatePresence mode="popLayout">
        {cards.slice(0, 3).map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            removeCard={removeCard}
            getIconComponent={getIconComponent}
            totalCards={Math.min(cards.length, 3)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Card({ card, index, removeCard, getIconComponent, totalCards }) {
  const zIndex = totalCards - index;
  const yOffset = index * 30;
  const xOffset = index * 5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 100, x: xOffset }}
      animate={{
        opacity: 1,
        y: yOffset,
        x: xOffset,
        scale: 1 - index * 0.04,
        rotateZ: index * -3,
      }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 500, damping: 50, mass: 1 }}
      style={{
        zIndex,
        boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px ${
          card.colors.shadow
        }`,
        backgroundColor: card.colors.primary,
      }}
      className="absolute left-0 top-0 h-full w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
      drag={index === 0}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (index === 0) {
          const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
          if (distance > 150) {
            removeCard(card.id);
          }
        }
      }}
      whileDrag={{
        scale: 1.05,
        boxShadow: `0 ${15 + index * 5}px ${40 + index * 10}px ${
          card.colors.shadow
        }`,
      }}
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl"
        style={{ color: card.colors.text }}
      >
        <div className="flex items-center justify-between p-4">
          <div
            className="rounded-full p-2"
            style={{ backgroundColor: `${card.colors.text}20` }}
          >
            {getIconComponent(card.icon)}
          </div>
          <div
            className="rounded-full p-2"
            style={{ backgroundColor: `${card.colors.text}20` }}
          >
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="px-4 py-2">
          <h2 className="text-3xl font-bold">{card.title}</h2>
          <h3
            className="text-xl font-medium"
            style={{ color: `${card.colors.text}99` }}
          >
            {card.subtitle}
          </h3>
        </div>

        <div className="mt-2 overflow-hidden px-4">
          <div
            className="aspect-video w-full overflow-hidden rounded-xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${card.imageUrl})`,
              boxShadow: `0 10px 30px ${card.colors.shadow}`,
            }}
          />
        </div>

        <div className="mt-auto p-4">
          <div
            className="rounded-full px-3 py-1 text-sm inline-flex items-center gap-1"
            style={{ backgroundColor: `${card.colors.text}20` }}
          >
            <DollarSign className="h-4 w-4" />
            {card.subtitle}
          </div>
          <p className="mt-3 text-sm opacity-80">{card.description}</p>
        </div>

        {index === 0 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <motion.div
              className="h-1 w-10 rounded-full"
              style={{ backgroundColor: `${card.colors.text}40` }}
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
