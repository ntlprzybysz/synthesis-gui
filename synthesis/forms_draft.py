from django import forms
# from django.forms import ModelChoiceField, ValidationError
# from django.core.exceptions import ValidationError

class InputForm(forms.Form):  
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

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data


class InputFormLJSpeech11(InputForm):
    VOICE_OPTIONS = [
        ("Linda Johnson", "Linda Johnson"),
    ]

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
        required=False,
    )

    def clean_voice(self):
        # No validation for this field
        return self.cleaned_data['voice']


class InputForm6208(InputForm):
    VOICE_OPTIONS = [
        ("6208 (sdp)", "6208-sdp"),
    ]

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
        required=False,
    )

    def clean_voice(self):
        # No validation for this field
        return self.cleaned_data['voice']
    

class InputFormMagK(forms.Form):
    VOICE_OPTIONS = [
        ("6446-MagK (sdp)", "6446-MagK-sdp"),
    ]

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
        required=False,
    )

    def clean_voice(self):
        # No validation for this field
        return self.cleaned_data['voice']

class InputFormTZ(InputForm):
    VOICE_OPTIONS = [
        ("6450 (sdp)", "6450-sdp"),
    ]

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
        required=False,
    )

    def clean_voice(self):
        # No validation for this field
        return self.cleaned_data['voice']