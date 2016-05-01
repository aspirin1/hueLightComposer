/*global define */

define(['angular'], function (angular) {
    'use strict';

    return angular.module('app.config', [])
        .constant('VERSION', '0.1')
        .constant('PlaceholderDataUrl', 'data:image/jpeg;base64,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cKKKKBAelR1IxwtR0AFFFFABRRRQZjX6U2nP0ptVEAqNutSVGetUAVIOlR09fu0ALTkPzU2lX71TIB9FFFSAUUUUGgU6Om05OtADqKKKACiiigCSikU/LS0GgUUUVmTEKch4ptKpwaCh9FFFABTlbFNooKXmSA5oJxUdFAco5nptFFAegUUUUEiMcLTKc5yabQAUUUUCkFFFBOK0GRsfmooooMwooooAR/u0ynOeKbQAUUUUAFFFFBmNkptOfrTaqIBUZOTUlR1QBT0Py0ynIeKAHUDrRRSlsBJRQDmioAKKKKC47BSr96koBxQMkooooAKKKKAHIadTEOGp9BcQoooqZC6hRRRUlDkORTqjBwakByKACiiigAooooAKKKKAChjgUUxmyaAEooooAKKKKaJ6hSOcLS01zzVjew2iiiggKKKKAGueabSsfmpKACiiigT2CiiiggY/3qShutFVEAbpUdPf7tMqgCnIeabSofmoAfRRRSewD1Py0tNQ8U6oAKKKKCohRRRQUSKcrRTUNOoAKKKKACpAcio6choKiOooopMbCiiioBBQDg0UUDJAc0VHnFOD0AOopN4o3CgBaCcU0vTSc0AKzZpKKKACiiigAoooq4iiFRk5NPc4FMpikFFFFBIUE4opHOFoAZRRRQAUUUUEyCgnFFIx+WgkZRRRVx2Aa54ptOc802mAUA4NFFAElFCnIooAch5p1RqcGpKzAKKKKBxCiiigsVThqfUdSA5FABRRRQAUA4NFFAElFNQ06g0CiiipkS9NQoooqSgooooAKKKKACiiigAooooAKKKKpIncKKKRjgVRQ1jk0lFFBmFFFFABTXPNOqMnJoAKKKKACiiigmQU1zxTqa55oJG0UUVoAxj81JQTmigAooooAch4p1NQ806gAqQHIqOnIeKiW4DqKKKQBRRRQaBTkNNoBwaAJKKKKACiiigAqQHIqOlU4NA0x9FGc0UFhRRRUuJNuwUUUVIcwUUUUDugooooFzBRRRVKIWvuFFFFUUGcVGTk05mzTaCZMKKKKCQooooARzgUylc5NJQAUUUUAFFFFBmFRk5NPY4WmU0AUMcLRTXNWA2iiigAooooBADg1JUdPU5WgBachwabRUyAkooByKKkAooooKiFFFFBQ5DkU6owcGpKACiiigAooooAVWxT85qOlVsUFJj6KAc0UFBRRRQAUUUUuVC5UFFFFMYUUUE4oAKazUM2abQS2FFFFBIUUUUAFDHAopjHJoASiiigAooooFIKKKKCBrmm0E5NFVEApjnLU8nFR1QBRRRQAUUUUExCnIabQDg0FElFFFADkPFOpinBp9ZgFFFFAIKKKKDQKchptFAElFCnIooAKKKKACiiigAzinB6bRQBIDmio6XcaCuYfRTd9G+gfMOozimbjSZoFzDi+KaTmiigVwooooEFFFFABRRQTgUAI5wKZQTk0UAFFFFABRRRQQwpGOFpaa5yaBDaKKK0QDXPFNpznJptABRRRQTIKKKKBIKKKKCx6nIpaahwadQAU9TkUylU4NTIB9FFFSAUUUUFRCiiigoAcGpM5qOlVsGgB9FFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFMZsmlZqbQAUUUUAFFFFAmFFFFBAE4FR05zTaaAKCcCimuasBtFFFABRRRQTIKKKKCQooooNEFSA5FR05DQA6iiihgPU5FLTFODT6zAKKKKACiiig0CiiigBytinZzUdKGxQA+igHNFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFBOKACms1IzZpKACiiigAooooAKKKKDMKCcCimucmgBtFFFWgCoycmnOcCm0wCiiigAooooMwopqHIp1BT7hRRRQEQooooKJAciimocU6gApyHIptAODUyAkooByKKkAooooGmFFFFBYUUUUAGcU4PTaKAJM0VGDinB6AHUUgbNLnNABRRRQAUUZpC1AC0U0vTSc0AOL4ppOaKKACiiigAooooAKKKKCWwooooJEY4FMoY5NFVEAooprnFUA0nJooooAKKKKCZBRRQxwKAif/Z')
        .constant('FirebaseUrl', 'https://resplendent-torch-1627.firebaseio.com/')
        .constant('ColorsJson', '["#3f02ff","#643bff","#8018ff","#645fff","#8153ff","#9842ff","#ad24ff","#6479ff","#8271ff","#9a67ff","#b05bff","#c54aff","#d82eff","#658fff","#8389ff","#9d83ff","#b37aff","#c971ff","#de64ff","#f253ff","#ff37f6","#65a3ff","#859fff","#9f9aff","#b795ff","#ce8eff","#e486ff","#f97dff","#ff69ee","#ff52dc","#ff37cb","#65b7ff","#87b4ff","#a3b0ff","#bbadff","#d3a8ff","#eaa3ff","#ff9bfb","#ff87e6","#ff75d4","#ff62c3","#ff4fb4","#ff37a5","#66c9ff","#89c8ff","#a6c6ff","#c0c4ff","#d9c1ff","#f2beff","#ffb2f3","#ff9fdd","#ff8ecb","#ff7dba","#ff6daa","#ff5d9c","#ff4c8e","#ff3880","#66dcff","#8bdcff","#aadbff","#c6dbff","#e0daff","#fbd9ff","#ffc6e9","#ffb3d4","#ffa2c1","#ff92b0","#ff84a0","#ff7691","#ff6882","#ff5974","#ff4a65","#ff3855","#67f0ff","#8ef1ff","#aef1ff","#ccf2ff","#e8f3ff","#ffeff9","#ffd8df","#ffc5ca","#ffb4b7","#ffa4a5","#ff9695","#ff8985","#ff7c75","#ff7065","#ff6354","#ff5641","#ff4825","#65fff9","#8dfff7","#adfff5","#c9fff2","#e3fff0","#fdffec","#ffe9d5","#ffd5bf","#ffc4ab","#ffb499","#ffa688","#ff9977","#ff8d66","#ff8154","#ff763e","#ff6b1e","#5effe6","#85ffe3","#a3ffe0","#beffdc","#d6ffd8","#eeffd4","#fff8c9","#ffe4b3","#ffd29f","#ffc38c","#ffb57a","#ffa867","#ff9c53","#ff913c","#58ffd5","#7effd1","#9bffcd","#b4ffc8","#cbffc3","#e1ffbd","#f7ffb6","#fff2a5","#ffe090","#ffd07c","#ffc268","#ffb553","#ffa939","#52ffc5","#77ffc0","#93ffbb","#acffb6","#c2ffaf","#d6ffa8","#ebffa0","#feff96","#ffec80","#ffdc6a","#ffce52","#ffc135","#4dffb5","#72ffb0","#8dffaa","#a4ffa4","#b9ff9c","#cdff94","#e0ff8a","#f2ff7d","#fff86b","#ffe851","#48ffa7","#6cffa1","#87ff9a","#9eff93","#b2ff8a","#c5ff80","#d7ff73","#e8ff64","#f9ff4f","#44ff98","#68ff92","#82ff8a","#97ff81","#abff77","#bdff6b","#ceff5b","#dfff46","#3fff8a","#63ff83","#7dff7a","#92ff6f","#a5ff63","#b6ff53","#3bff7c","#5fff73","#78ff69","#8dff5c","#9fff4c","#37ff6d","#5bff63","#74ff56","#88ff46","#33ff5d","#57ff50","#2fff4b"]')

    ;

});