<!-- README.md -->
# machin

# js
- pas `in` sur une array ça ca regarde les keys donc les indices

# Record<> vs register
- avec tout dans une map on doit importe tous les fichiers et le risque c'est les imports circulaires, donc c'est bien temps qu'on a qu'un seul fichier, et l'avantage c'est qu'avec un type union le compilateur nous dit le cas qu'on a pas géré si on fait un Record ou un switch
- avec register on doit faire un init à chaque fois et centraliser mais comme c'est au runtime il va pas se plaindre car il aura déjà importé toutes les signatures de fonctions. Le problème c'est qu'on a pas le compilateur pour nous dire quel cas on a pas géré

# events
## SignalBus
- Action locale (cliquer pour faire une explosion) -> SignalBus.emit('explosion_occured') -> les SignalBus.on('explosion_occured') réagissent pour update une quête par exemple
## TimelineEvent
- pour faire tourner la simulation, utile pour le mode hors-ligne

# A VOIR
- mettre flag sur attaque refletée pour pas faire boucle

# à faire
- ajouter système jour nuit avec event qui lance un nouvel event dans DAY_MS et change l'état etc.
- pareil pour saisons
