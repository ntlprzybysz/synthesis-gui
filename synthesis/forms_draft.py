from django import forms

# from django.core.exceptions import ValidationError


class InputFormLJSpeech11(forms.Form):
    VOICE_OPTIONS = [
        ("LINDAJOHNSON", "Linda Johnson"),
    ]

    SENTENCE_OPTIONS = [
        (1, "Sentence 1"),
    ]

    project_name = forms.CharField(
        max_length=254,
        min_length=3,
        widget=forms.TextInput(
            attrs={
                "id": "project-name-field",
                "placeholder": "Example synthesis",
                "class": "form-control form-control-lg",
                "style": "width: 250px; border-color: #212529; border: none; outline: 0;",
                "aria-label": "Project name",
            }
        ),
        initial="Example synthesis",
    )

    text_input = forms.CharField(
        max_length=500,
        required=False,
        widget=forms.Textarea(
            attrs={
                "id": "text-input-field",
                "class": "form-control mb-1",
                "style": "height: 527px; font-family: Andale Mono, monospace; border-color: #212529; border-radius: 0px;",
            }
        ),
        label="Text:",
    )

    ipa_input = forms.CharField(
        max_length=500,
        min_length=1,
        widget=forms.Textarea(
            attrs={
                "id": "ipa-input-field",
                "class": "form-control mb-1",
                "style": "height: 527px; font-family: Andale Mono, monospace; border-color: #212529; border-radius: 0px;",
            }
        ),
    )

    voice = forms.ChoiceField(
        choices=VOICE_OPTIONS,
        initial=VOICE_OPTIONS[0],
        widget=forms.Select(
            attrs={
                "id": "voice-select-field",
                "class": "form-select",
                "style": "margin-right: 3rem; margin-bottom: 1rem; border-color: #212529; border-radius: 0px;",
            }
        ),
    )

    sentence = forms.ChoiceField(
        choices=SENTENCE_OPTIONS,
        initial=SENTENCE_OPTIONS[0],
        widget=forms.Select(
            attrs={
                "id": "sentence-select-field",
                "class": "form-select",
                "style": "margin-right: 3rem; margin-bottom: 1rem; border-color: #212529; border-radius: 0px;",
            }
        ),
    )

    def clean_project_name(self):
        """
        Substitutes all characters that aren't a letter with an underscore.
        """
        project_name = self.cleaned_data["project_name"]
        cleaned_project_name = "".join(c if c.isalpha() else "_" for c in project_name)
        return cleaned_project_name

    def clean_text_input(self):
        """
        Discards all text input by subtituting it with an empty string.
        """
        return ""

    '''
    def clean_ipa_input(self):
        """
        Returns ValidationError if the input uses unallowed signs.      
        """

        ipa_input = self.cleaned_data['ipa_input']
        allowed_symbols = {
            "separators": {"|"},
            "pauses": {"SIL0", "SIL1", "SIL2"},
            "tone_markers": {"˥", "˦", "˧", "˨", "˩"},
            "length_markers": {"˘", "ˑ", "ː"},
            "stress_markers": {"ˈ", "ˌ"},
            "punctuation_marks": {",", "\"", "'", "-", "–", "—", "...", "…", ".", "?", "!", "(", ")", "[", "]", ":", ";"},
            "vowels": {"i", "y", "ɨ", "ʉ", "ɯ", "u", "ɪ", "ʏ", "ʊ", "e", "ø", "ɘ", "ɵ", "ɤ", "o", "ə", "ɛ", "œ", "ɜ", "ɞ", 
                       "ʌ", "ɔ", "æ", "ɐ", "a", "ɶ", "ä", "ɑ", "ɒ", "ɪ", "ɛ", "ʊ", "aɪ", "aʊ", "eɪ", "oʊ", "ɔɪ", "ɑɪ", "ɔr", 
                       "ɛr", "ɪr"}, 
            "consonants": {"p", "b", "t", "d", "k", "ɡ", "m", "n", "ɲ", "ŋ", "ʙ", "r", "ʀ", "ⱱ", "ɚ", "ɝ", "ɩ", "ɫ", "ɯ", "ɰ", 
                           "ɳ", "ɺ", "ɾ", "ɻ", "ɾ", "ɸ", "β", "θ", "ð", "s", "z", "ʃ", "ʒ", "ç", "ʝ", "x", "ɣ", "χ", "ʁ", "ħ", 
                           "ʕ", "h", "ɬ", "ɮ", "ʋ", "ɹ", "ɻ", "j", "ɰ", "ʍ", "w", "ʘ", "ǀ", "ǃ", "ǂ", "ǁ", "ɓ", "ɗ", "ɠ", "ʛ", 
                           "t͡", "d͡", "ʈ͡", "ʂ", "ʐ", "ɖ͡", "ɕ", "θ", "ç", "ɸ", "x", "χ", "ħ", "b", "d", "f", "ɡ", "h", "dʒ", 
                           "k", "l", "m", "n", "ŋ", "p", "ɹ", "s", "ʃ", "t", "θ", "v", "w", "j", "z", "ʒ"},
            "other_symbols": {"ı", "ˤ", "‖", "⁀", "⁺", "⁼", "˗", "̊","̥","̤","̰","̪","̩","̝","̞","́","̄","̀","̈","̃","̟","̱","̹","̜", "̚"},
        }
        
        # TODO 

        allowed_symbols_values = allowed_symbols.values()
        allowed_symbols_values = set(allowed_symbols_values)
        symbols_input = set(ipa_input)

        unallowed_symbols = list(symbols_input - allowed_symbols_values)

        if unallowed_symbols:
            formatted_unallowed_signs = ", ".join(unallowed_symbols)
            raise ValidationError(f"Used unallowed sign(s): {formatted_unallowed_signs}.")
        return ipa_input
    '''
